# add ssh keys

echo "Adding ssh keys"
eval `ssh-agent -s`
ssh-add ./ssh/id_gh_ncc

# add git submodules
echo "Adding git submodules"
git submodule init 
git submodule update

# finish
echo "Done"