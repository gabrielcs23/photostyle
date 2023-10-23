package br.com.photostyle.api.utils;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.FormulaEvaluator;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.util.NumberToTextConverter;

import java.math.BigDecimal;

public class ImportacaoXlsxHelper {
    private ImportacaoXlsxHelper() {
    }

    public static String getStringCellValue(Cell cell) {
        if (cell == null) {
            return null;
        }
        CellType cellType = cell.getCellType();
        String cellValue;
        if (cellType.equals(CellType.FORMULA)) {
            Workbook workbook = cell.getRow().getSheet().getWorkbook();
            FormulaEvaluator formulaEvaluator = workbook.getCreationHelper().createFormulaEvaluator();
            cellType = formulaEvaluator.evaluateFormulaCell(cell);
        }
        if (cellType.equals(CellType.NUMERIC)) {
            cellValue = NumberToTextConverter.toText(cell.getNumericCellValue());
            cellValue = stripTrailingZeros(cellValue);
        } else {
            cellValue = cell.getStringCellValue();
        }
        return cellValue.trim();
    }

    public static String stripTrailingZeros(String numericValue) {
        return new BigDecimal(numericValue.trim()).stripTrailingZeros().toPlainString();
    }
}
