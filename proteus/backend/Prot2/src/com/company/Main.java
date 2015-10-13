package com.company;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.Map;

public class Main {
    static int count = 0;
    public static void main(String[] args) {

        String path;

        getFile("/Users/junsuhlee/drat/src");
        System.out.println(count + "");
        path = "/Users/junsuhlee/drat/src";
        boolean stopoodt = stopoodt();
        boolean resetoodt = resetoodt();
        boolean runoodt = runoodt();
        boolean crawl = crawl(path);
        boolean index= index(path);
        boolean map = map(path);
        boolean reduce = reduce(path);



        if(args.length > 0){
            //check valid path or not
            path = args[0];
            path = "/Users/junsuhlee/";
            stopoodt();
            resetoodt();
            runoodt();

        }else{

        }


    }

    static boolean stopoodt() {
        try{
            String line;
            ProcessBuilder oodtStop = new ProcessBuilder(
                    "/Users/junsuhlee/drat/deploy/bin/oodt", "stop");
            setUpEnvironment(oodtStop);
            oodtStop.redirectErrorStream(true);

            Process stopProcess = oodtStop.start();
            BufferedReader oodtStopReader = new BufferedReader(new InputStreamReader(stopProcess.getInputStream()));

            while (true) {
                line = oodtStopReader.readLine();
                if (line == null) {
                    break;
                }
                System.out.println(line);
            }
            return true;
        }catch(IOException ex){
            //oodt stop error
        }
        return false;

    }
    static boolean resetoodt() {
        try{
            String line;
            ProcessBuilder removingOne = new ProcessBuilder(
                    "rm", "-rf", "/Users/junsuhlee/drat/deploy/data/workflow");
            setUpEnvironment(removingOne);
            removingOne.redirectErrorStream(true);

            removingOne.start();

            ProcessBuilder removingTwo = new ProcessBuilder(
                    "rm", "-rf", "/Users/junsuhlee/drat/deploy/filemgr/catalog");
            setUpEnvironment(removingTwo);
            removingTwo.redirectErrorStream(true);

            removingTwo.start();

            ProcessBuilder removingThree = new ProcessBuilder(
                    "rm", "-rf", "/Users/junsuhlee/drat/deploy/solr/drat/data");
            setUpEnvironment(removingThree);
            removingThree.redirectErrorStream(true);

            removingThree.start();

            ProcessBuilder removingFour = new ProcessBuilder(
                    "rm", "-rf", "/Users/junsuhlee/drat/deploy/data/archive/*");
            setUpEnvironment(removingFour);
            removingFour.redirectErrorStream(true);

            removingFour.start();


            ProcessBuilder removeWorlflowPid = new ProcessBuilder(
                    "rm", "/Users/junsuhlee/drat/deploy/workflow/run/cas.workflow.pid");
            setUpEnvironment(removeWorlflowPid);
            removeWorlflowPid.redirectErrorStream(true);

            removeWorlflowPid.start();

            ProcessBuilder removeFileMgrPid = new ProcessBuilder(
                    "rm", "/Users/junsuhlee/drat/deploy/filemgr/run/cas.filemgr.pid");
            setUpEnvironment(removeFileMgrPid);
            removeFileMgrPid.redirectErrorStream(true);

            removeFileMgrPid.start();

            ProcessBuilder removeResMgr = new ProcessBuilder(
                    "rm", "/Users/junsuhlee/drat/deploy/resmgr/run/cas.resmgr.pid");
            setUpEnvironment(removeResMgr);
            removeResMgr.redirectErrorStream(true);

            removeResMgr.start();

            return true;
        }catch(IOException ex){
            //oodt reset error
        }
        return false;

    }
    static boolean runoodt() {
        try{
            String line;
            //run oodtBuilder
            ProcessBuilder oodtBuilder = new ProcessBuilder(
                    "/Users/junsuhlee/drat/deploy/bin/oodt", "start");
            setUpEnvironment(oodtBuilder);
            oodtBuilder.redirectErrorStream(true);
            Process oodtProcess = oodtBuilder.start();
            BufferedReader oodtReader = new BufferedReader(new InputStreamReader(oodtProcess.getInputStream()));

            while (true) {
                line = oodtReader.readLine();
                if (line == null) {
                    break;
                }
                System.out.println(line);
            }

            return true;
        }catch(IOException ex){
            //oodt run error
        }
        return false;

    }
    static boolean crawl(String path){
        try {
            String line;



            //run Go
            ProcessBuilder builder = new ProcessBuilder(
                    "/Users/junsuhlee/drat/deploy/bin/drat", "crawl", path);
            setUpEnvironment(builder);
            builder.redirectErrorStream(true);
            Process p = builder.start();
            BufferedReader r = new BufferedReader(new InputStreamReader(p.getInputStream()));

            int numOfFilesIngested = 0;
            while (true) {
                line = r.readLine();
                //ready to ingest
                if(line.startsWith("INFO: ProductCrawler: Ready to ingest product")){
                    String[] split = line.split(":");
                    String[] parts = split[3].split("/");

                    System.out.println(parts[parts.length - 1] + " is ready to ingest");
                }
                //ingesting product
                if(line.startsWith("INFO: StdIngester: ingesting product: ProductName:")){
                    String[] split = line.split(":");

                    System.out.println(split[4] + " is ingesting");
                }

                //ingested product
                if(line.startsWith("INFO: Successfully ingested product:")){
                    String[] split = line.split(":");

                    System.out.println(split[3] + " is ingested");
                    numOfFilesIngested++;
                    System.out.println(numOfFilesIngested + " files are ingested");
                }

                if (line == null) {
                    break;
                }

            }
            return true;
        } catch (Exception e) {
            System.out.println(e);
        }
        return false;
    }

    static boolean index(String path){
        try {
            String line;



            //run Index
            ProcessBuilder builder = new ProcessBuilder(
                    "/Users/junsuhlee/drat/deploy/bin/drat", "index", path);
            setUpEnvironment(builder);
            builder.redirectErrorStream(true);
            Process p = builder.start();
            BufferedReader r = new BufferedReader(new InputStreamReader(p.getInputStream()));

            while (true) {
                line = r.readLine();
                if (line == null) {
                    break;
                }
                System.out.println(line);
            }
            return true;
        } catch (Exception e) {
            System.out.println(e);
        }
        return false;
    }

    static boolean map(String path){
        try {
            String line;



            //run map
            ProcessBuilder builder = new ProcessBuilder(
                    "/Users/junsuhlee/drat/deploy/bin/drat", "map");
            setUpEnvironment(builder);
            builder.redirectErrorStream(true);
            Process p = builder.start();
            BufferedReader r = new BufferedReader(new InputStreamReader(p.getInputStream()));

            while (true) {
                line = r.readLine();
                if (line == null) {
                    break;
                }
                System.out.println(line);
            }
            return true;
        } catch (Exception e) {
            System.out.println(e);
        }
        return false;
    }
    static boolean reduce(String path){
        try {
            String line;



            //run reduce
            ProcessBuilder builder = new ProcessBuilder(
                    "/Users/junsuhlee/drat/deploy/bin/drat", "reduce");
            setUpEnvironment(builder);
            builder.redirectErrorStream(true);
            Process p = builder.start();
            BufferedReader r = new BufferedReader(new InputStreamReader(p.getInputStream()));

            while (true) {
                line = r.readLine();
                if (line == null) {
                    break;
                }
                System.out.println(line);
            }
            return true;
        } catch (Exception e) {
            System.out.println(e);
        }
        return false;
    }
    static void setUpEnvironment(ProcessBuilder builder) {
        Map<String, String> env = builder.environment();
        // blah blah
        env.put("JAVA_HOME", "/Library/Java/JavaVirtualMachines/jdk1.8.0_51.jdk/Contents/Home");
        env.put("DRAT_HOME", "/Users/junsuhlee/drat/deploy");
        env.put("GANGLIA_URL", "http://zipper.jpl.nasa.gov/ganglia/");


    }
    static void getFile(String dirPath) {
        File f = new File(dirPath);
        File[] files = f.listFiles();

        if (files != null)
            for (int i = 0; i < files.length; i++) {
                count++;
                File file = files[i];

                if (file.isDirectory()) {
                    getFile(file.getAbsolutePath());
                }
            }
    }
}

