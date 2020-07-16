package br.com.photostyle.api.security;

import br.com.photostyle.api.security.model.entity.UsuarioEntity;
import br.com.photostyle.api.security.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserDetailsService implements org.springframework.security.core.userdetails.UserDetailsService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
    public UserDetails loadUserByUsername(String nomeUsuario) throws UsernameNotFoundException {
        UsuarioEntity usuario = usuarioRepository.getByNomeUsuario(nomeUsuario);
        if (usuario == null) {
            return new User(" ", " ",
                    true, true, true, true,
                    getAuthorities(" "));
        }
        return new User(usuario.getNomeUsuario(), usuario.getSenha(),
                true, true, true, true,
                getAuthorities(usuario.getRole()));
    }

    private List<? extends GrantedAuthority> getAuthorities(String role) {
        List<GrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority(role));
        return authorities;
    }

}
