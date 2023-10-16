package br.com.photostyle.api.email.pdf;

import com.lowagie.text.Chunk;
import com.lowagie.text.Document;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfWriter;

import javax.activation.DataSource;
import javax.mail.util.ByteArrayDataSource;
import java.io.ByteArrayOutputStream;
import java.io.OutputStream;

public class PDFHelper {
    private PDFHelper() {
    }

    public static PDFDto writeToPDF(String name) throws Exception {
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        writePdf(outputStream);
        byte[] bytes = outputStream.toByteArray();
        DataSource dataSource = new ByteArrayDataSource(bytes, "application/pdf");
        return new PDFDto(name, dataSource);
    }

    private static void writePdf(OutputStream outputStream) throws Exception {
        Document document = new Document();
        PdfWriter.getInstance(document, outputStream);
        document.open();
        Paragraph paragraph = new Paragraph();
        paragraph.add(new Chunk("hello!"));
        document.add(paragraph);
        document.close();
    }
}
