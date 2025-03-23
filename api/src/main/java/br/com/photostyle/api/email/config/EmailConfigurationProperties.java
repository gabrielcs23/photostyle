package br.com.photostyle.api.email.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties("personalizacao.email")
public class EmailConfigurationProperties {
    private String pixTipo;
    private String pixChave;
    private String telefone;
    private String contato;

    public String getPixTipo() {
        return pixTipo;
    }

    public void setPixTipo(String pixTipo) {
        this.pixTipo = pixTipo;
    }

    public String getPixChave() {
        return pixChave;
    }

    public void setPixChave(String pixChave) {
        this.pixChave = pixChave;
    }

    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }

    public String getContato() {
        return contato;
    }

    public void setContato(String contato) {
        this.contato = contato;
    }
}
