# Visual Studio Code Unix System Services (USS) Extension for Zowe

This Visual Studio Code (VSC) Extension for Zowe lets you interact with Unix System Services (USS) files that are stored on IBM z/OS mainframes. You can explore file taxonomys and view file contents. Interacting with files using VSC can be more convenient than using command-line interfaces or 3270 emulators.

 **Important!** To use the VSC Extension USS for Zowe, you must install Zowe CLI version **`2.0.0`** or later.

The VSC Extension for Zowe is powered by [Zowe CLI](https://zowe.org/home/). The extension demonstrates the potential for plug-ins powered by Zowe.

## Contents

* [Prerequisites](#prerequisites)
* [Configuration and usage tips](#configuration-and-usage-tips)
* [Sample use cases](#sample-use-cases)

**Tip:** For information about how to install the extension from a `VSIX` file and run system tests on the extension, see the [Developer README](./docs/README.md) file that is located in the docs folder of this repository.

## Prerequisites

After you install the Zowe extension, meet the following prerequisites:

* [Install Zowe CLI](https://zowe.github.io/docs-site/user-guide/cli-installcli.html) on your PC.
  
    **Important!** To use the VSC Extension for Zowe, you must install Zowe CLI version `2.0.0` or later.
* [Create at least one Zowe CLI 'zosmf' profile](https://zowe.github.io/docs-site/user-guide/cli-installcli.html#creating-a-zowe-cli-profile).

## Configuration and usage tips

**Tip:** By default, Visual Studio Code does not highlight data set syntax. To enhance the experience of using the extension, download an extension that highlights syntax, such as COBOL.

## Sample use cases

Review the following use cases to understand how to use this extension.

### View data sets and use multiple filters

1. Navigate to your explorer tree.
2. Open the **Unix System Services (USS)** bar.
3. Select the profile that you want to filter.
4. Click the **Search Unix System Services (USS) by Entering a Path** magnifying glass.
5. From the drop-down, enter the path that you want to filter.  
  The files that match your path display in the explorer tree.

<!-- TODO
![Enter Pattern](https://github.com/mheuzey/temp/blob/master/resources/gifs/patterns.gif?raw=true "Enter Pattern")
<br /><br /> -->

### Refresh the list of files

1. Navigate to your explorer tree.
2. Click **Refresh All** button on the right of the **Unix System Services (USS)** explorer bar as illustrated by the following screen:

<!-- TODO 
![Refresh All](https://github.com/mheuzey/temp/blob/master/resources/gifs/refreshAll.gif?raw=true "Refresh All")
<br /><br /> -->

### Download,an existing file

1. Navigate to your explorer tree.
2. Open the **Unix System Services (USS)** bar.
3. Open a profile.  
4. Click the file that you want to download.

    **Note:** To view the children of a directory, click the directory to expand the tree.
    
    The file displays in the text editor window of VSC. 

<!-- TODO 6. Edit the document.
7. Navigate back to the PDS member (or PS) in the explorer tree, and click the **Safe Save** button. -->

<!-- Your PDS member (or PS) is uploaded.  

**Note:** If someone else has made changes to the PDS member (or PS) while you were editing it, you can merge your conflicts before uploading to the mainframe. -->
<!-- 
![Edit](https://github.com/mheuzey/temp/blob/master/resources/gifs/download_edit_upload.gif?raw=true "Edit")
<br /><br /> -->

<!-- ### Use Safe Save to prevent merge conflicts

1. Navigate to your explorer tree.
2. Open the **Unix System Services (USS)** bar.
3. Open a profile.
4. Download and edit a data set.
5. Click the **Safe Save** button for the data set that you opened in the explorer tree.
6. Resolve merge conflicts if necessary.

![Safe Save](https://github.com/mheuzey/temp/blob/master/resources/gifs/safesave.gif?raw=true "Safe Save")
<br /><br />

### Create a new PDS and a PDS member

1. Navigate to your explorer tree.
2. Open the **Unix System Services (USS)** bar.
3. Select the **Create New Data Set** button to specify the profile that you want to use to create the data set.
4. From the drop-down menu, select the type of PDS that you want to create.
5. Enter a name for the PDS.
   The PDS is created.
6. To create a member, right-click the PDS and select **Create New Member**.
7. Enter a name for the member.
   The member is created. 

![Create](https://github.com/mheuzey/temp/blob/master/resources/gifs/new_pds_new_member.gif?raw=true "Create")
<br /><br /> -->

<!-- ### Delete a PDS member and a PDS

1. Navigate to your explorer tree.
2. Open the **Unix System Services (USS)** bar.
3. Open the profile and PDS containing the member.
4. Right-click on the PDS member that you want to delete and select **Delete Member**.
5. Confirm the deletion by clicking **Yes** on the drop-down menu.
    
    **Note:** Alternatively, you can select 'No' to cancel the deletion.
6. To delete a PDS, right-click the PDS and click **Delete PDS**, then confirm the deletion.
    
    **Note:** You can delete a PDS before you you delete its members.

![Delete](https://github.com/mheuzey/temp/blob/master/resources/gifs/delete_pds_delete_member.gif?raw=true "Delete")
<br /><br /> -->

### View and access multiple profiles simultaneously 

1. Navigate to your explorer tree.
2. Open the **Unix System Services (USS)** bar.
2. Click the **Add Profile** button on the right of the **Unix System Services (USS)** explorer bar.
3. Select the profile that you want to add to the view as illustrated by the following screen.

<!-- TODO
![Add Profile](https://github.com/mheuzey/temp/blob/master/resources/gifs/addProfile.gif?raw=true "Add Profile")
<br /><br /> -->

### Add and edit information that defines how to create data sets

1. Navigate to to File, Preferences, Settings.
2. In the section **Default User Settings**, scroll to **Zowe Configuration** and expand the options.
3. Click the **Edit** button to the left of the Unix System Services (USS) settings that you want to edit.
4. Select **Copy to Settings**.
5. Edit the settings as needed.

