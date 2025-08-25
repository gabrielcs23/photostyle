package br.com.photostyle.api.email.service;

import br.com.photostyle.api.email.config.EmailConfigurationProperties;
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
import java.io.File;
import java.util.Date;
import java.util.Map;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private SpringTemplateEngine templateEngine;

    @Autowired
    private EmailConfigurationProperties configProperties;

    @Value("${spring.mail.username}")
    private String mailSistema;

    public void enviarEmailSistema(Map<String, Object> templateModel, File anexo) {
        try {
            String nPedido = (String) templateModel.get("nPedido");
            String subject = "Pedido " + nPedido;
            String to = mailSistema;
            enviarEmailComTemplate(to, subject, templateModel, TemplatesEmail.RESUMO_PEDIDO_SISTEMA, anexo);
        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }

    public void enviarEmailResponsavel(String to, Map<String, Object> templateModel) {
        try {
            fillConfigParaEmailResponsavel(templateModel);
            String nPedido = (String) templateModel.get("nPedido");
            String subject = "Pedido realizado " + nPedido;
            enviarEmailComTemplate(to, subject, templateModel, TemplatesEmail.CONFIRMACAO_PEDIDO, null);
        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }

    private void fillConfigParaEmailResponsavel(Map<String, Object> templateModel) {
        templateModel.put("pixTipo", configProperties.getPixTipo());
        templateModel.put("pixChave", configProperties.getPixChave());
        templateModel.put("empresaTelefone", configProperties.getTelefone());
        templateModel.put("empresaEmail", configProperties.getContato());
    }

    private void enviarEmailComTemplate(
            String to, String subject, Map<String, Object> templateModel, String templateName, File anexo) throws MessagingException {

        Context context = new Context();
        context.setVariables(templateModel);
        String htmlBody = templateEngine.process(templateName, context);
        enviarEmail(to, subject, htmlBody, anexo);
    }

    private void enviarEmail(String to, String subject, String htmlBody, File anexo) throws MessagingException {
        MimeMessage mail = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mail, true, "UTF-8");
        helper.setFrom(mailSistema);
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(htmlBody, true);
        if (anexo != null) {
            helper.addAttachment(anexo.getName(), anexo);
        }
        helper.setSentDate(new Date());
        mailSender.send(helper.getMimeMessage());
    }

}
