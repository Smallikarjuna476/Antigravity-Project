import os
from datetime import datetime
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image as RLImage, HRFlowable
from app.core.config import settings

class PDFReportGenerator:
    """
    Generates professional, enterprise-grade clinical agronomic diagnosis reports in PDF format.
    """

    def generate_disease_report(
        self,
        report_id: str,
        diagnosis_data: dict,
        farmer_name: str = "Registered Farmer",
        farm_location: str = "Mysuru, Karnataka",
        original_img_path: str = None,
        heatmap_img_path: str = None
    ) -> str:
        pdf_filename = f"AgriSense_Diagnosis_Report_{report_id[:8]}.pdf"
        output_pdf_path = os.path.join(settings.REPORTS_DIR, pdf_filename)

        doc = SimpleDocTemplate(
            output_pdf_path,
            pagesize=letter,
            rightMargin=36,
            leftMargin=36,
            topMargin=36,
            bottomMargin=36
        )

        styles = getSampleStyleSheet()
        primary_color = colors.HexColor("#065F46")  # Emerald 800
        accent_color = colors.HexColor("#0D9488")   # Teal 600
        dark_text = colors.HexColor("#1F2937")       # Gray 800
        light_bg = colors.HexColor("#F0FDF4")        # Emerald 50
        border_color = colors.HexColor("#D1FAE5")

        # Custom typography styles
        title_style = ParagraphStyle(
            'DocTitle',
            parent=styles['Heading1'],
            fontSize=20,
            leading=24,
            textColor=primary_color,
            fontName="Helvetica-Bold"
        )
        subtitle_style = ParagraphStyle(
            'DocSubtitle',
            parent=styles['Normal'],
            fontSize=9,
            leading=12,
            textColor=colors.HexColor("#4B5563")
        )
        section_heading = ParagraphStyle(
            'SectionHeading',
            parent=styles['Heading2'],
            fontSize=12,
            leading=16,
            textColor=primary_color,
            fontName="Helvetica-Bold",
            spaceBefore=10,
            spaceAfter=6
        )
        body_style = ParagraphStyle(
            'BodyTextCustom',
            parent=styles['Normal'],
            fontSize=9,
            leading=13,
            textColor=dark_text
        )
        bold_label = ParagraphStyle(
            'BoldLabel',
            parent=styles['Normal'],
            fontSize=9,
            leading=13,
            fontName="Helvetica-Bold",
            textColor=primary_color
        )

        elements = []

        # 1. Header Banner
        header_data = [
            [
                Paragraph("<b>AGRISENSE AI</b><br/><font size=8 color='#0D9488'>Intelligent Agriculture Decision Support Platform</font>", title_style),
                Paragraph(f"<b>DIAGNOSTIC REPORT</b><br/><b>Report ID:</b> {report_id[:8].upper()}<br/><b>Date:</b> {datetime.now().strftime('%d %b %Y, %I:%M %p')}", subtitle_style)
            ]
        ]
        header_table = Table(header_data, colWidths=[320, 220])
        header_table.setStyle(TableStyle([
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('ALIGN', (1, 0), (1, 0), 'RIGHT'),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ]))
        elements.append(header_table)
        elements.append(HRFlowable(width="100%", thickness=2, color=primary_color, spaceBefore=4, spaceAfter=12))

        # 2. Farmer & Metadata Overview
        meta_data = [
            [
                Paragraph(f"<b>Farmer:</b> {farmer_name}", body_style),
                Paragraph(f"<b>Location:</b> {farm_location}", body_style),
                Paragraph(f"<b>Crop Analyzed:</b> {diagnosis_data.get('crop', 'Unknown')}", body_style)
            ]
        ]
        meta_table = Table(meta_data, colWidths=[180, 180, 180])
        meta_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#F8FAFC")),
            ('PADDING', (0, 0), (-1, -1), 6),
            ('BOX', (0, 0), (-1, -1), 1, colors.HexColor("#E2E8F0")),
            ('ROUNDEDCORNERS', [4, 4, 4, 4]),
        ]))
        elements.append(meta_table)
        elements.append(Spacer(1, 10))

        # 3. AI Pathology Diagnosis Summary Box
        severity_color = "#DC2626" if diagnosis_data.get("severity") == "Severe" else ("#D97706" if diagnosis_data.get("severity") == "Moderate" else "#16A34A")
        
        diag_summary_data = [
            [
                Paragraph("<b>DIAGNOSED CONDITION:</b>", bold_label),
                Paragraph(f"<b>{diagnosis_data.get('disease')}</b> <i>({diagnosis_data.get('scientific_name', '')})</i>", ParagraphStyle('DiagName', fontSize=11, fontName="Helvetica-Bold", textColor=primary_color)),
            ],
            [
                Paragraph("<b>Confidence Level:</b>", bold_label),
                Paragraph(f"<b>{diagnosis_data.get('confidence_percentage', '98.5%')}</b> (EfficientNetB3 Saliency)", body_style),
            ],
            [
                Paragraph("<b>Severity Rating:</b>", bold_label),
                Paragraph(f"<font color='{severity_color}'><b>{diagnosis_data.get('severity', 'Moderate').upper()}</b></font> (Estimated affected canopy: <b>{diagnosis_data.get('affected_area_pct', 0.0)}%</b>)", body_style),
            ],
            [
                Paragraph("<b>Pathogen Class:</b>", bold_label),
                Paragraph(f"{diagnosis_data.get('category', 'Fungal')}", body_style),
            ]
        ]
        diag_table = Table(diag_summary_data, colWidths=[140, 400])
        diag_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), light_bg),
            ('PADDING', (0, 0), (-1, -1), 5),
            ('BOX', (0, 0), (-1, -1), 1, border_color),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ]))
        elements.append(diag_table)
        elements.append(Spacer(1, 10))

        # 4. Side-by-side Images (Original vs Grad-CAM)
        if original_img_path and os.path.exists(original_img_path) and heatmap_img_path and os.path.exists(heatmap_img_path):
            try:
                img1 = RLImage(original_img_path, width=250, height=150)
                img2 = RLImage(heatmap_img_path, width=250, height=150)
                
                img_data = [
                    [Paragraph("<b>Original Leaf Specimen</b>", body_style), Paragraph("<b>Explainable Grad-CAM Heatmap Attention</b>", body_style)],
                    [img1, img2]
                ]
                img_table = Table(img_data, colWidths=[270, 270])
                img_table.setStyle(TableStyle([
                    ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
                    ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
                ]))
                elements.append(img_table)
                elements.append(Spacer(1, 10))
            except Exception as e:
                print(f"Error adding images to PDF: {e}")

        # 5. Clinical Symptoms & Root Causes
        elements.append(Paragraph("Clinical Symptoms & Biological Cause", section_heading))
        symptom_text = f"<b>Symptoms:</b> {diagnosis_data.get('symptoms', 'N/A')}<br/><br/><b>Etiology/Cause:</b> {diagnosis_data.get('cause', 'N/A')}"
        elements.append(Paragraph(symptom_text, body_style))
        elements.append(Spacer(1, 10))

        # 6. Prescribed Agronomic Treatment Protocol
        elements.append(Paragraph("Recommended Treatment Protocol", section_heading))
        
        treatments = diagnosis_data.get("treatments", {})
        treatment_data = [
            [
                Paragraph("<b>Treatment Type</b>", bold_label),
                Paragraph("<b>Prescription & Application Details</b>", bold_label)
            ],
            [
                Paragraph("<b>Organic / Bio-Control</b>", body_style),
                Paragraph(treatments.get("organic", "Apply bio-fungicides such as Trichoderma or Neem formulations."), body_style)
            ],
            [
                Paragraph("<b>Chemical / Fungicide</b>", body_style),
                Paragraph(f"{treatments.get('chemical', 'Standard copper-based or systemic spray.')}<br/><b>Dosage:</b> {treatments.get('dosage_guide', '2g/L')}<br/><b>Frequency:</b> {treatments.get('application_interval', '7-10 days')}", body_style)
            ],
            [
                Paragraph("<b>Preventive Measures</b>", body_style),
                Paragraph(diagnosis_data.get("prevention_tips", "Crop rotation and drip irrigation."), body_style)
            ]
        ]
        treatment_table = Table(treatment_data, colWidths=[140, 400])
        treatment_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#E2E8F0")),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
            ('PADDING', (0, 0), (-1, -1), 6),
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ]))
        elements.append(treatment_table)
        elements.append(Spacer(1, 12))

        # 7. Expert Advisory Notice & Footer
        footer_text = (
            "<i>Note: This clinical report was generated by AgriSense AI Diagnostic Engine using deep learning visual analysis. "
            "For epidemic outbreaks or severe crop stress, please consult your nearest Krishi Vigyan Kendra (KVK) or Regional Agriculture Extension Officer.</i>"
        )
        elements.append(Paragraph(footer_text, ParagraphStyle('FooterNote', parent=subtitle_style, fontSize=7.5, leading=10, textColor=colors.HexColor("#64748B"))))

        # Build document
        doc.build(elements)
        return pdf_filename

pdf_report_generator = PDFReportGenerator()
