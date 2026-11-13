from io import BytesIO
import qrcode
from reportlab.lib import colors
from reportlab.lib.pagesizes import landscape, A4
from reportlab.lib.utils import ImageReader
from reportlab.pdfgen import canvas


def generate_qr_png_bytes(url: str) -> BytesIO:
    qr = qrcode.QRCode(version=1, box_size=8, border=2)
    qr.add_data(url)
    qr.make(fit=True)
    img = qr.make_image(fill_color="#00D4FF", back_color="#030B20")
    buf = BytesIO()
    img.save(buf, format="PNG")
    buf.seek(0)
    return buf


def generate_certificate_pdf(certificate) -> BytesIO:
    """Generates a futuristic Seekhvo AI Learning PDF certificate with embedded QR verification."""
    buffer = BytesIO()
    width, height = landscape(A4)
    c = canvas.Canvas(buffer, pagesize=landscape(A4))

    # Deep Navy Background (#030B20)
    c.setFillColor(colors.HexColor("#030B20"))
    c.rect(0, 0, width, height, stroke=0, fill=1)

    # Outer glowing cyan border (#00D4FF) & inner electric blue frame (#087BFF)
    c.setStrokeColor(colors.HexColor("#00D4FF"))
    c.setLineWidth(2.5)
    c.roundRect(24, 24, width - 48, height - 48, 14, stroke=1, fill=0)

    c.setStrokeColor(colors.HexColor("#087BFF"))
    c.setLineWidth(1)
    c.roundRect(34, 34, width - 68, height - 68, 10, stroke=1, fill=0)

    # Header Branding
    c.setFillColor(colors.HexColor("#00D4FF"))
    c.setFont("Helvetica-Bold", 14)
    c.drawCentredString(width / 2, height - 80, "SEEKHVO AI LEARNING  •  seekhvo.space")

    c.setFillColor(colors.HexColor("#FFFFFF"))
    c.setFont("Helvetica-Bold", 34)
    c.drawCentredString(width / 2, height - 135, "CERTIFICATE OF COMPLETION")

    c.setFillColor(colors.HexColor("#A8B8D8"))
    c.setFont("Helvetica", 14)
    c.drawCentredString(width / 2, height - 180, "This is to certify that")

    # Student Name
    c.setFillColor(colors.HexColor("#FFFFFF"))
    c.setFont("Helvetica-Bold", 30)
    c.drawCentredString(width / 2, height - 230, certificate.recipient_name)

    # Accent Divider
    c.setStrokeColor(colors.HexColor("#00D4FF"))
    c.setLineWidth(1.5)
    c.line(width / 2 - 180, height - 248, width / 2 + 180, height - 248)

    c.setFillColor(colors.HexColor("#A8B8D8"))
    c.setFont("Helvetica", 14)
    c.drawCentredString(width / 2, height - 280, "has successfully completed the program")

    # Course Title
    c.setFillColor(colors.HexColor("#42A5FF"))
    c.setFont("Helvetica-Bold", 24)
    c.drawCentredString(width / 2, height - 320, certificate.course_title)

    c.setFillColor(colors.HexColor("#A8B8D8"))
    c.setFont("Helvetica", 12)
    c.drawCentredString(width / 2, height - 352, f"Standing: {certificate.grade_or_remarks}")

    # Metadata & Signature Block
    c.setFillColor(colors.HexColor("#FFFFFF"))
    c.setFont("Helvetica-Bold", 11)
    c.drawString(72, 102, f"Certificate ID: {certificate.certificate_id}")
    c.setFillColor(colors.HexColor("#A8B8D8"))
    c.setFont("Helvetica", 11)
    c.drawString(72, 84, f"Issued Date: {certificate.issued_date.strftime('%B %d, %Y')}")
    c.drawString(72, 66, f"Verify at: {certificate.verification_url}")

    # Center Signature Line
    c.setStrokeColor(colors.HexColor("#A8B8D8"))
    c.setLineWidth(1)
    c.line(width / 2 - 90, 95, width / 2 + 90, 95)
    c.setFillColor(colors.HexColor("#FFFFFF"))
    c.setFont("Helvetica-Bold", 11)
    c.drawCentredString(width / 2, 78, "Academic Director, Seekhvo")

    # QR Code on Bottom Right
    qr_buf = generate_qr_png_bytes(certificate.verification_url)
    qr_image = ImageReader(qr_buf)
    c.drawImage(qr_image, width - 165, 58, width=96, height=96, mask="auto")
    c.setFillColor(colors.HexColor("#A8B8D8"))
    c.setFont("Helvetica", 8)
    c.drawCentredString(width - 117, 46, "Scan to Verify")

    c.showPage()
    c.save()
    buffer.seek(0)
    return buffer
