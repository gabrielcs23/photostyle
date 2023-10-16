package br.com.photostyle.api.email.service;

import br.com.photostyle.api.email.pdf.PDFDto;
import br.com.photostyle.api.email.templates.TemplatesEmail;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.lang.Nullable;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring5.SpringTemplateEngine;

import javax.activation.DataSource;
import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import java.util.Date;
import javax.mail.util.ByteArrayDataSource;
import java.io.ByteArrayOutputStream;
import java.util.Map;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private SpringTemplateEngine templateEngine;

    @Value("${spring.mail.username}")
    private String mailSistema;

    public void enviarEmailSistema(Map<String, Object> templateModel, PDFDto pdfDto) {
        try {
            String nPedido = (String) templateModel.get("nPedido");
            String subject = "Pedido " + nPedido;
            String to = mailSistema;
            enviarEmailComTemplate(to, subject, templateModel, TemplatesEmail.RESUMO_PEDIDO_SISTEMA, pdfDto);
        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }

    public void enviarEmailResponsavel(String to, Map<String, Object> templateModel) {
        try {
            String nPedido = (String) templateModel.get("nPedido");
            String subject = "Pedido realizado " + nPedido;
            enviarEmailComTemplate(to, subject, templateModel, TemplatesEmail.CONFIRMACAO_PEDIDO);
        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }

    private void enviarEmailComTemplate(
            String to,
            String subject,
            Map<String, Object> templateModel,
            String templateName) throws MessagingException {
        enviarEmailComTemplate(to, subject, templateModel, templateName, null);
    }

    private void enviarEmailComTemplate(
        String to,
        String subject,
        Map<String, Object> templateModel,
        String templateName,
        @Nullable PDFDto pdfDto) throws MessagingException {

        Context context = new Context();
        context.setVariables(templateModel);
        String htmlBody = templateEngine.process(templateName, context);
        enviarEmail(to, subject, htmlBody, pdfDto);
    }

    private void enviarEmail(String to, String subject, String htmlBody, @Nullable PDFDto pdfDto)
            throws MessagingException {
        MimeMessage mail = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mail, "UTF-8");
        helper.setFrom(mailSistema);
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(htmlBody, true);
        if (pdfDto != null) {
            helper.addAttachment(pdfDto.getName(), pdfDto.getDataSource());
        }
        helper.setSentDate(new Date());
        mailSender.send(helper.getMimeMessage());
    }

}
