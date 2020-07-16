package br.com.photostyle.api.security.repository;

import br.com.photostyle.api.security.model.entity.UsuarioEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<UsuarioEntity, Long> {

    Optional<UsuarioEntity> findByNomeUsuario(String nomeUsuario);

}
