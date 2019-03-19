import { profile, normalPattern } from "../resources/testProfileData";
import { Create, CreateDataSetTypeEnum, Upload, Delete} from "@brightside/core";
import { Session, Logger } from "@brightside/imperative";

const session: Session = new Session({
  hostname: profile.host,
  user: profile.user,
  password: profile.password,
  port: profile.port,
  rejectUnauthorized: profile.rejectUnauthorized,
  type: "basic"
});

/**
 * Creates the system test environment
 */
export async function createSystemTestEnvironment() {
  await createUSSDirectory(`${normalPattern}`);
  await createUSSDirectory(`${normalPattern}/aDir1`);
  await createUSSFile(`${normalPattern}/aDir1/aFile1.txt`);
  await createUSSFile(`${normalPattern}/aFile2.txt`);
  await createUSSDirectory(`${normalPattern}/aDir2`);
  await createUSSDirectory(`${normalPattern}/group`);
  await createUSSDirectory(`${normalPattern}/group/aDir3`);
  await createUSSDirectory(`${normalPattern}/group/aDir4`);
  await createUSSFile(`${normalPattern}/group/aDir4/aFile3.txt`);
  await createUSSDirectory(`${normalPattern}/group/aDir5`);
  await createUSSFile(`${normalPattern}/group/aDir5/aFile4.txt`);
  await createUSSFile(`${normalPattern}/group/aDir5/aFile5.txt`);
  await createUSSDirectory(`${normalPattern}/group/aDir6`);
}

/**
 * Clean's up the system test environment
 */
export async function cleanupSystemTestEnvironment() {
  await deleteAllFiles(`${normalPattern}`);
}

function deleteAllFiles(name: string) {
  Logger.getConsoleLogger().info(`Deleting Dataset: ${name}`);
  return Delete.ussFile(session, name, true);
}

function createUSSFile(name: string) {
  Logger.getConsoleLogger().info(`Creating USS File: ${name}`);
  return Create.uss(session, name, "file");
}

function createUSSDirectory(name: string) {
  Logger.getConsoleLogger().info(`Creating USS Directory: ${name}`);
  return Create.uss(session, name, "directory");
}
