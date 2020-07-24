package br.com.photostyle.api.security.service;

import br.com.photostyle.api.security.model.entity.UsuarioEntity;
import br.com.photostyle.api.security.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class UserDetailsImplService implements UserDetailsService {

    @Autowired
    private UsuarioRepository repository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<UsuarioEntity> usuarioOptional = repository.findByNomeUsuario(username);
        UsuarioEntity usuarioEntity;
        if (usuarioOptional.isPresent()) {
            usuarioEntity = usuarioOptional.get();
        } else {
            throw new UsernameNotFoundException(username);
        }

        List<GrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority(usuarioEntity.getRole()));

        return new User(usuarioEntity.getNomeUsuario(),usuarioEntity.getSenha(), authorities);
    }

}
