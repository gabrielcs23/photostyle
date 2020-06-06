package br.com.photostyle.api.service;

import br.com.photostyle.api.model.adapter.BaseAdapter;
import br.com.photostyle.api.model.entity.BaseEntity;
import br.com.photostyle.api.repository.BaseRepository;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import javax.validation.constraints.NotNull;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public abstract class BaseService<T extends BaseEntity, V> {

    protected BaseRepository<T> repository;
    protected BaseAdapter<T, V> adapter;

    public BaseService(BaseRepository<T> repository, BaseAdapter<T, V> adapter) {
        this.repository = repository;
        this.adapter = adapter;
    }

    public List<V> listar() {
        return repository.findAll().stream().map(this.adapter::entityToDto).collect(Collectors.toList());
    }

    public V getPorId(@NotNull Long id) {
        T entity = getEntityPorId(id);
        return adapter.entityToDto(entity);
    }

    public T getEntityPorId(Long id) {
        Optional<T> optional = repository.findById(id);
        return optional.orElse(null);
    }

    @Transactional
    public V criar(V dtoNovo) {
        T entityNova = adapter.dtoToEntity(dtoNovo);
        T entitySaved = repository.save(entityNova);
        return adapter.entityToDto(entitySaved);
    }

    @Transactional
    public void remover(@NotNull Long id) {
        repository.deleteById(id);
    }

}
