package br.com.photostyle.api.security.repository;

import br.com.photostyle.api.security.model.entity.UsuarioEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsuarioRepository extends JpaRepository<UsuarioEntity, Long> {

    UsuarioEntity getByNomeUsuario(String nomeUsuario);

}
