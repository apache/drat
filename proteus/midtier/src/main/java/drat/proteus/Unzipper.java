package drat.proteus;

import backend.FileConstants;

import java.io.*;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

/**
 * Created by stevenfrancus on 11/13/15.
 */
public class Unzipper {
    public static final String OUTPUT_FOLDER = FileConstants.DRAT_TEMP_UNZIPPED_PATH;
    public static File unzip (File zipped) throws FileNotFoundException, IOException {
        File folder = new File(OUTPUT_FOLDER);
        byte[] buffer = new byte[1024];
        if(!folder.exists()) {
            folder.mkdir();
        }
        ZipInputStream zis = new ZipInputStream(new FileInputStream(zipped));
        ZipEntry ze = zis.getNextEntry();
        while(ze!=null) {
            String fileName = ze.getName();
            File newFile = new File(OUTPUT_FOLDER + File.separator + fileName);
                    //System.out.println("file unzip : "+ newFile.getAbsoluteFile());
                    //create all non exists folders
                    //else you will hit FileNotFoundException for compressed folder
            new File(newFile.getParent()).mkdirs();
            FileOutputStream fos = new FileOutputStream(newFile);
            int len = 0;
            while ((len = zis.read(buffer)) > 0) {
                fos.write(buffer, 0, len);
            }
            fos.close();
            ze = zis.getNextEntry();
        }
        zis.closeEntry();
        zis.close();
        return folder;
    }
}
