# add ssh keys
echo "Adding ssh keys"
eval `ssh-agent -s`
chmod 600 ./ssh/id_gh_ncc
ssh-add ./ssh/id_gh_ncc

# add git submodules
echo "Adding git submodules"
git submodule init
git submodule update --recursive --remote --init

# finish
echo "Done"
