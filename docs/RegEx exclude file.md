Exclude file(s) based on a RegEx keyword in DRAT
---

**What**

This is an added feature to exclude processing of file(s) in DRAT.

---

**Why**

While traversing SVN or GIT or any other repositories, we often find a need to exclude the subversion directories like ".svn" and ".git". The feature can be leverged to such tasks. You may even specify file/directory name which you don't want to process.

---

**How to use**

It's easy to use. Just add --exclude parameter and "regular expression" to exclude and rest DRAT will take care. Below are some examples -
```
$DRAT_HOME/bin/drat crawl --exclude "\\.svn" "path_to_your_repository"
```
```
$DRAT_HOME/bin/drat go --exclude "\\.svn" "path_to_your_repository"
```

The above regex will exclude all files which has ".svn" folder in its absolute path.
