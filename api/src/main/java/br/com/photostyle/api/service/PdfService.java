package br.com.photostyle.api.service;

import br.com.photostyle.api.email.templates.TemplatesEmail;
import com.lowagie.text.DocumentException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring5.SpringTemplateEngine;
import org.xhtmlrenderer.pdf.ITextRenderer;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.util.Map;

@Service
public class PdfService {

    @Autowired
    private SpringTemplateEngine templateEngine;

    public File gerarEtiquetaPdf(Map<String, Object> templateModel) throws IOException, DocumentException {
        Context context = new Context();
        context.setVariables(templateModel);
        String html = templateEngine.process(TemplatesEmail.ETIQUETA_PEDIDO, context);

        String nPedido = (String) templateModel.get("nPedido");
        String outputFileName = "etiqueta-pedido-" + nPedido.replace("#", "") + ".pdf";
        File outputFile = new File(outputFileName);
        OutputStream outputStream = new FileOutputStream(outputFile);

        ITextRenderer renderer = new ITextRenderer();
        renderer.setDocumentFromString(html);
        renderer.layout();
        renderer.createPDF(outputStream);

        outputStream.close();
        return outputFile;
    }
}
