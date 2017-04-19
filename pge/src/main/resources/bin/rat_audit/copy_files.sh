FILELIST=${1}
FSEP=${2}
JOB_INPUT_DIR=${3}
sList=($(echo $FILELIST | sed -e 's/'"$FSEP"'/\n/g' | while read line; do echo $line | sed 's/[\t ]/'"$FSEP"'/g'; done))
for (( i = 0; i < ${#sList[@]}; i++ )); do sList[i]=$(echo ${sList[i]} | sed 's/'"$FSEP"'/ /g'); done
for (( i = 0; i < ${#sList[@]}; i++ )); do 
echo ${sList[i]};
#file=`printf '%q' "${sList[i]}"`
file="${sList[i]}"
newFile=`echo ${file} | sed 's/\//_|_/g'`
echo "From: $file"
echo "To: $newFile"
rsync -av --backup --suffix=_`date +"%m%d%Y_%H%M"` "${file}" "${JOB_INPUT_DIR}/${newFile}"
done
