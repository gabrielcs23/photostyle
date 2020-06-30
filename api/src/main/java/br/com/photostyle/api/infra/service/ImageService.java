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

    public void saveImage(MultipartFile image, String imgName) {
        try {
            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setContentLength(image.getSize());
            metadata.setContentType(image.getContentType());

            amazonClient.putObject(
                    new PutObjectRequest(constants.getBucket(),
                            imgName, image.getInputStream(),
                            metadata)
                    .withCannedAcl(CannedAccessControlList.PublicRead));

        } catch (AmazonServiceException | IOException e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
    }

    public void deleteImage(String imgName) {
        try {
            amazonClient.deleteObject(new DeleteObjectRequest(constants.getBucket(), imgName));
        } catch (AmazonClientException e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
    }

}
