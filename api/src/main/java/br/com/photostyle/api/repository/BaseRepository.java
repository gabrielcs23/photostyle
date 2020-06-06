package br.com.photostyle.api.repository;

import br.com.photostyle.api.model.entity.BaseEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BaseRepository<T extends BaseEntity> extends JpaRepository<T, Long> {

}
