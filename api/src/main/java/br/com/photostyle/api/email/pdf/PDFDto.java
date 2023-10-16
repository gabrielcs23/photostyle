package br.com.photostyle.api.email.pdf;

import javax.activation.DataSource;

public class PDFDto {
    private final String name;
    private final DataSource dataSource;

    public PDFDto(String name, DataSource dataSource) {
        this.name = name;
        this.dataSource = dataSource;
    }

    public String getName() {
        return name;
    }

    public DataSource getDataSource() {
        return dataSource;
    }
}
