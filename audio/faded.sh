for i in normalized/*.wav; do
	base_name=$(basename $i)
	ffmpeg -y -i $i -af "afade=d=1, areverse, afade=d=1, areverse" "faded/$base_name";
done
