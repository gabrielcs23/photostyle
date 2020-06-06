package br.com.photostyle.api.infra.service;

import br.com.photostyle.api.infra.amazon.AmazonConstants;
import com.amazonaws.AmazonClientException;
import com.amazonaws.AmazonServiceException;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.DeleteObjectRequest;
import com.amazonaws.services.s3.model.PutObjectRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class ImageService {

    @Autowired
    private AmazonS3 amazonClient;

    private String buildImageUrl(String fileName) {
        return "http://s3." + AmazonConstants.REGION + ".amazonaws.com/" + AmazonConstants.BUCKET + "/" + fileName;
    }

    public String saveImage(MultipartFile image) {
        try {
            amazonClient.putObject(
                    new PutObjectRequest(AmazonConstants.BUCKET,
                            image.getOriginalFilename(), image.getInputStream(),
                            null)
                    .withCannedAcl(CannedAccessControlList.PublicRead));

            return buildImageUrl(image.getOriginalFilename());
        } catch (AmazonServiceException | IOException e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
    }

    public void deleteImage(String imageUrl) {
        String fileName = imageUrl.substring(imageUrl.lastIndexOf("/") + 1);
        try {
            amazonClient.deleteObject(new DeleteObjectRequest(AmazonConstants.BUCKET, fileName));
        } catch (AmazonClientException e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
    }

}
