package br.com.photostyle.api.service;

import br.com.photostyle.api.model.adapter.AnoAdapter;
import br.com.photostyle.api.model.dto.AnoDto;
import br.com.photostyle.api.model.entity.AnoEntity;
import br.com.photostyle.api.repository.AnoRepository;
import org.springframework.stereotype.Service;

@Service
public class AnoService extends BaseService<AnoEntity, AnoDto> {

    public AnoService(AnoRepository repository, AnoAdapter adapter) {
        super(repository, adapter);
    }
}
