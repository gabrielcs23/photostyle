package br.com.photostyle.api.service.exception;

/**
 * Operação recusada por uma regra de negócio. A mensagem descreve a condição que torna a operação válida
 * e é devolvida ao cliente no corpo da resposta 400.
 */
public class RegraNegocioException extends RuntimeException {

    public RegraNegocioException(String mensagem) {
        super(mensagem);
    }
}
