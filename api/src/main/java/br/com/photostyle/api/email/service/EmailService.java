package br.com.photostyle.api.email.service;

import br.com.photostyle.api.email.templates.TemplatesEmail;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring5.SpringTemplateEngine;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import java.util.Date;
import java.util.Map;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private SpringTemplateEngine templateEngine;

    @Value("${spring.mail.username}")
    private String mailSistema;

    public void enviarEmailSistema(Map<String, Object> templateModel) {
        try {
            String nPedido = (String) templateModel.get("nPedido");
            String subject = "Pedido " + nPedido;
            String to = mailSistema;
            enviarEmailComTemplate(to, subject, templateModel, TemplatesEmail.RESUMO_PEDIDO_SISTEMA);
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
        String to, String subject, Map<String, Object> templateModel, String templateName) throws MessagingException {

        Context context = new Context();
        context.setVariables(templateModel);
        String htmlBody = templateEngine.process(templateName, context);
        enviarEmail(to, subject, htmlBody);
    }

    private void enviarEmail(String to, String subject, String htmlBody) throws MessagingException {
        MimeMessage mail = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mail, "UTF-8");
        helper.setFrom(mailSistema);
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(htmlBody, true);
        helper.setSentDate(new Date());
        mailSender.send(helper.getMimeMessage());
    }

}
