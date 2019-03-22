# Visual Studio Code Unix System Services (USS) Extension for Zowe (Work in progress)

This Visual Studio Code (VSC) Extension for Zowe lets you interact with Unix System Services (USS) files that are stored on IBM z/OS mainframes. You can explore file taxonomys and view file contents. Interacting with files using VSC can be more convenient than using command-line interfaces or 3270 emulators.

The VSC Extension for Zowe is powered by [Zowe CLI](https://zowe.org/home/). The extension demonstrates the potential for plug-ins powered by Zowe.

This extension is currently under development and subject to improvement based upon feedback. For example it is likely to be considered to be merged with the Dataset VSCode extension.

## Contents

* [Prerequisites](#prerequisites)
* [Configuration and usage tips](#configuration-and-usage-tips)
* [Sample use cases](#sample-use-cases)

**Tip:** For information about how to install the extension from a `VSIX` file and run system tests on the extension, see the [Developer README](./docs/README.md) file that is located in the docs folder of this repository.

## Prerequisites

After you install the Zowe extension, meet the following prerequisites:

* [Install Zowe CLI](https://zowe.github.io/docs-site/latest/user-guide/cli-installcli.html) on your PC.
  
    **Important!** To use the VSC Extension for Zowe, you must install Zowe CLI version `2.14.0` or later.
* [Create at least one Zowe CLI 'zosmf' profile](https://zowe.github.io/docs-site/latest/getting-started/cli-getting-started.html#using-profiles).

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

