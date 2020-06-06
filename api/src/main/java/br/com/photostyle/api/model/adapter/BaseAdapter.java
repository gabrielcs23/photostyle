package br.com.photostyle.api.model.adapter;

import org.springframework.stereotype.Component;

import java.util.List;

@Component
public abstract class BaseAdapter<T,V> {

    public abstract T dtoToEntity(V dto);
    public abstract V entityToDto(T entity);

    public abstract List<V> entityListToDtoList(List<T> entityList);
}
