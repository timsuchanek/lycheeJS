
# Documentation

The documentation is always hosted on the documentation branch.
First, you have to make sure you are up-to-date for the newest implementations.


```bash
git clone https://github.com/LazerUnicorns/lycheeJS.git;
cd lycheeJS;
git checkout documentation-0.9;
```


After you have checked out the correct branch, you may want to edit some files.
The folder structure of the api folder has to be identical to the source folder.

```javascript

if (exists('/lychee/source/game/Entity.js') && !exists('/lychee/api/game/Entity.md')) {
    contributor.writeAPIDocs('lychee.game.Entity');
}

```



# Feature Requests

Upcoming feature requests are better stored in their own branch, so
we can make usage of pull requests on github.

First, you have to fork the project on github to your own repository.
This allows you to work on the feature before the decision of merging
it in was done.

This example shows how the feature branches work.
Replace *yourname* accordingly with your github username.
Replace *fancy-feature* accordingly with a better description for your
feature.


```bash
git clone git@github.com:YourName/lycheeJS.git;
cd lycheeJS;
git checkout development-0.9;
git checkout -b fancy-feature;

# BEGIN of your own work
echo "foo" > ./worksimulation.txt;
git add worksimulation.txt;
git commit -m "Meaningful description";
# END of your own work

git push origin fancy-feature;

```

Now, you can go on github to your repository and switch to the
*fancy-feature* branch. After you did that, there's a new green
button appearing with the label "Pull Request".

Click on it, now you have to fill out the form with the description.
After that, we can now automatically merge in your implemented
features.

