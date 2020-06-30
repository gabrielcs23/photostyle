package br.com.photostyle.api.infra.service;

import br.com.photostyle.api.infra.amazon.AmazonConstants;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
public class ImageNameManager {

    @Autowired
    private AmazonConstants constants;

    public String buildName(String originalName) {
        String randomName = RandomStringUtils.randomAlphanumeric(15, 20);
        String fileExtension = StringUtils.getFilenameExtension(originalName);

        return String.format("%s.%s",randomName, fileExtension);
    }

    public String buildUrl(String fileName) {
        return "https://s3." + constants.getRegion() + ".amazonaws.com/" + constants.getBucket() + "/" + fileName;
    }

}
