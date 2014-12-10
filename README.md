#WP TO GRAV

This a simple tool to migrate WP Blogs to to [Grav](http://getgrav.com) using Node.

As this is not a Node module, the easiest way to use it is probably by cloning this repo (but I believe that using npm should work really good too).

```sh
git clone git@github.com:DezminSites/wp-to-grav.git
```

After, just install de the Node modules

```sh
cd wp-to-grav && npm install
```
and run the code, informing your xml export from WP

```sh
node index.js [yourfile.xml]
```

If everything goes right, your posts should be in the 'posts' directory!