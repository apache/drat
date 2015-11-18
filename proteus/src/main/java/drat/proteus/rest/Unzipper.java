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
}
