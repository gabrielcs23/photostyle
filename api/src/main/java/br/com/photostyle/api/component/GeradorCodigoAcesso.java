package br.com.photostyle.api.component;

import org.springframework.stereotype.Component;

import java.math.BigInteger;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Random;

@Component
public class GeradorCodigoAcesso {

    public String gerarCodigo(String nomeEscola, String matricula) {
        String codEscola = gerarCodEscola(nomeEscola);
        String codAluno = gerarCodMatricula(matricula);
        return String.format("%s-%s", codEscola.toUpperCase(), codAluno.toUpperCase());
    }

    /**
     * Gera hash de Escola e devolve a substring
     * do "meio da string" com tamanho 4
     *
     * @param nomeEscola string de nome único de Escola
     * @return código identificador de Escola
     */
    private String gerarCodEscola(String nomeEscola) {
        return gerarHash(nomeEscola).substring(11,15);
    }

    /**
     * Gera hash de matrícula e devolve uma substring
     * a partir de uma posição aleatória de tamanho 6.
     * Aleatoriedade procura evitar possíveis conflitos
     * em uma substring de hash.
     *
     * @param matricula string identificadora de Aluno na Escola
     * @return código identificador de matrícula
     */
    private String gerarCodMatricula(String matricula) {
        String hashMatricula = gerarHash(matricula);

        int tam = 6;
        Random rand = new Random();
        int inicio = rand.nextInt(hashMatricula.length() - tam + 1);
        return hashMatricula.substring(inicio, inicio + tam);
    }

    /**
     * Calcula hash (cifra) MD5 a partir da string de
     * parametro e converte para string de hexadecimal
     *
     * @param s string para cifrar
     * @return string com tamanho 26
     */
    private String gerarHash(String s) {
        try {
            MessageDigest m = MessageDigest.getInstance("MD5");
            m.update(s.getBytes(), 0, s.length());
            byte[] hash = m.digest();
            return new BigInteger(1,hash).toString(32);
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
            throw new RuntimeException("Erro na geração de código");
        }
    }

}
