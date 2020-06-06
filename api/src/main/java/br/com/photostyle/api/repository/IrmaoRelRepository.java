package br.com.photostyle.api.repository;

import br.com.photostyle.api.model.entity.IrmaoRelEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface IrmaoRelRepository extends JpaRepository<IrmaoRelEntity, Long> {

    @Query("SELECT DISTINCT i FROM IrmaoRelEntity AS i INNER JOIN AlunoEntity AS a ON i.id = a.irmaoRel.id WHERE a.id IN (:idsAlunos)")
    IrmaoRelEntity getDistinctIrmaoRelByAlunosIds(@Param("idsAlunos") List<Long> idsAlunos);

}
