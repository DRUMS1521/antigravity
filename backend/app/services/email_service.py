import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from app.core.config import settings


def send_solicitud_email(solicitud) -> bool:
    if not settings.SMTP_USER or not settings.SMTP_PASSWORD:
        print("[EMAIL] Credenciales SMTP no configuradas, omitiendo envío.")
        return False

    html_body = f"""
    <html>
    <body style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #1a6b3a; padding: 20px; border-radius: 8px 8px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 20px;">
          Nueva Solicitud de Recreación
        </h1>
        <p style="color: #d4f0e0; margin: 5px 0 0 0;">Comfenalco Tolima</p>
      </div>
      <div style="background: #f9f9f9; padding: 24px; border: 1px solid #e0e0e0; border-radius: 0 0 8px 8px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; font-weight: bold; color: #555; width: 40%;">Empresa:</td>
              <td style="padding: 8px 0;">{solicitud.empresa}</td></tr>
          <tr style="background:#fff;"><td style="padding: 8px 0; font-weight: bold; color: #555;">Fecha del Evento:</td>
              <td style="padding: 8px 0;">{solicitud.fecha_evento}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold; color: #555;">Hora de Inicio:</td>
              <td style="padding: 8px 0;">{solicitud.hora_inicio}</td></tr>
          <tr style="background:#fff;"><td style="padding: 8px 0; font-weight: bold; color: #555;">Hora de Finalización:</td>
              <td style="padding: 8px 0;">{solicitud.hora_fin}</td></tr>
          <tr style="background:#fff;"><td style="padding: 8px 0; font-weight: bold; color: #555;">Ciudad:</td>
              <td style="padding: 8px 0;">{solicitud.ciudad}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold; color: #555;">Dirección:</td>
              <td style="padding: 8px 0;">{solicitud.direccion}</td></tr>
          <tr style="background:#fff;"><td style="padding: 8px 0; font-weight: bold; color: #555;">Recreadores:</td>
              <td style="padding: 8px 0;">{solicitud.cantidad_recreadores}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold; color: #555;">Cantidad de Personas:</td>
              <td style="padding: 8px 0;">{solicitud.cantidad_personas}</td></tr>
          <tr style="background:#fff;"><td style="padding: 8px 0; font-weight: bold; color: #555;">Tipo de Público:</td>
              <td style="padding: 8px 0;">{solicitud.tipo_publico}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold; color: #555;">Tipo de Servicio:</td>
              <td style="padding: 8px 0;">{solicitud.tipo_servicio}</td></tr>
          <tr style="background:#fff;"><td style="padding: 8px 0; font-weight: bold; color: #555;">Contacto:</td>
              <td style="padding: 8px 0;">{solicitud.contacto}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold; color: #555;">Teléfono/Email:</td>
              <td style="padding: 8px 0;">{solicitud.telefono_email}</td></tr>
          <tr style="background:#fff;"><td style="padding: 8px 0; font-weight: bold; color: #555; vertical-align: top;">Observaciones:</td>
              <td style="padding: 8px 0;">{solicitud.observaciones or "—"}</td></tr>
        </table>
        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
        <p style="color: #888; font-size: 12px; text-align: center;">
          Solicitud #{solicitud.id} | Sistema de Recreación Comfenalco Tolima
        </p>
      </div>
    </body>
    </html>
    """

    msg = MIMEMultipart("alternative")
    msg["Subject"] = f"Nueva Solicitud de Recreación - {solicitud.empresa}"
    msg["From"] = settings.EMAIL_FROM
    msg["To"] = settings.EMAIL_RECREACION

    msg.attach(MIMEText(html_body, "html"))

    with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
        server.starttls()
        server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
        server.sendmail(settings.EMAIL_FROM, settings.EMAIL_RECREACION, msg.as_string())

    print(f"[EMAIL] Correo enviado para solicitud #{solicitud.id}")
    return True
