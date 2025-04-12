package br.com.photostyle.api.model.dto;

import br.com.photostyle.api.model.entity.AlunoEntity;
import br.com.photostyle.api.model.entity.FotoEntity;

public class AlunoComFotoDTO {
    private AlunoEntity aluno;
    private FotoEntity foto;

    public AlunoComFotoDTO(AlunoEntity aluno, FotoEntity foto) {
        this.aluno = aluno;
        this.foto = foto;
    }

    public AlunoEntity getAluno() {
        return aluno;
    }

    public FotoEntity getFoto() {
        return foto;
    }
}
