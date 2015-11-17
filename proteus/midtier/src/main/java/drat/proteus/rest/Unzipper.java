package drat.proteus.rest;

import backend.FileConstants;
import net.lingala.zip4j.core.ZipFile;
import net.lingala.zip4j.exception.ZipException;
import net.lingala.zip4j.util.Zip4jUtil;

import java.io.*;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

public class Unzipper {
    public static final String OUTPUT_FOLDER = FileConstants.DRAT_TEMP_UNZIPPED_PATH;

    public static File unzip(File zipped) throws ZipException {
        ZipFile zipFile = new ZipFile(zipped.getAbsolutePath());
        zipFile.extractAll(OUTPUT_FOLDER);
        return new File(OUTPUT_FOLDER);
    }
    /*public static File unzip (File zipped) throws IOException {
        File folder = new File(OUTPUT_FOLDER);
        System.out.println(folder.getCanonicalPath());
        byte[] buffer = new byte[1024];
        if(!folder.exists()) {
            folder.mkdir();
        }
        ZipInputStream zis = new ZipInputStream(new FileInputStream(zipped));
        ZipEntry ze = zis.getNextEntry();
        while(ze!=null) {
            String fileName = ze.getName();
            File newFile = new File(OUTPUT_FOLDER + File.separator + fileName);
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
    }*/
}
