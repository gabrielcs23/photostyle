package br.com.photostyle.api.infra.service;

import br.com.photostyle.api.infra.amazon.AmazonConstants;
import com.amazonaws.AmazonClientException;
import com.amazonaws.AmazonServiceException;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.DeleteObjectRequest;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class ImageService {

    @Autowired
    private AmazonS3 amazonClient;

    @Autowired
    private AmazonConstants constants;

    private String buildImageUrl(String fileName) {
        return "http://s3." + constants.getRegion() + ".amazonaws.com/" + constants.getBucket() + "/" + fileName;
    }

    public String saveImage(MultipartFile image) {
        try {
            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setContentLength(image.getSize());
            amazonClient.putObject(
                    new PutObjectRequest(constants.getBucket(),
                            image.getOriginalFilename(), image.getInputStream(),
                            metadata)
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
            amazonClient.deleteObject(new DeleteObjectRequest(constants.getBucket(), fileName));
        } catch (AmazonClientException e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
    }

}
