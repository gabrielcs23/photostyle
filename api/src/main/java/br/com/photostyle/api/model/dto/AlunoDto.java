package br.com.photostyle.api.model.dto;

public class AlunoDto {

    private Long id;

    private String nome;

    private String matricula;

    private EscolaDto escola;

    private TurmaDto turma;

    private IrmaoRelDto irmaoRel;

    private FotoDto foto;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getMatricula() {
        return matricula;
    }

    public void setMatricula(String matricula) {
        this.matricula = matricula;
    }

    public EscolaDto getEscola() {
        return escola;
    }

    public void setEscola(EscolaDto escola) {
        this.escola = escola;
    }

    public TurmaDto getTurma() {
        return turma;
    }

    public void setTurma(TurmaDto turma) {
        this.turma = turma;
    }

    public IrmaoRelDto getIrmaoRel() {
        return irmaoRel;
    }

    public void setIrmaoRel(IrmaoRelDto irmaoRel) {
        this.irmaoRel = irmaoRel;
    }

    public FotoDto getFoto() {
        return foto;
    }

    public void setFoto(FotoDto foto) {
        this.foto = foto;
    }
}
