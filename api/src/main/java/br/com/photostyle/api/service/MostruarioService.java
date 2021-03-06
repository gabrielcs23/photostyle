package br.com.photostyle.api.service;

import br.com.photostyle.api.model.adapter.MostruarioAdapter;
import br.com.photostyle.api.model.dto.MostruarioDto;
import br.com.photostyle.api.model.entity.EscolaEntity;
import br.com.photostyle.api.model.entity.MostruarioEntity;
import br.com.photostyle.api.repository.MostruarioRepository;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;

@Service
public class MostruarioService {

    private final MostruarioRepository repository;
    private final MostruarioAdapter adapter;

    public MostruarioService(MostruarioRepository repository, MostruarioAdapter adapter) {
        this.repository = repository;
        this.adapter = adapter;
    }

    @Transactional
    public void criar(EscolaEntity escola) {
        MostruarioEntity entity = new MostruarioEntity();
        entity.setEscola(escola);
        repository.save(entity);
    }


    public MostruarioDto getPorEscola(Long idEscola) {
        MostruarioEntity mostruario = repository.getMostruarioEntityByEscola_Id(idEscola);
        if (mostruario == null) return null;
        return adapter.entityToDto(mostruario);
    }

}
