package br.com.photostyle.api.repository;

import br.com.photostyle.api.model.entity.FotoEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FotoRepository extends JpaRepository<FotoEntity, Long> {
}
