for i in *.wav; do
	ffmpeg -i $i -af "afade=d=1, areverse, afade=d=1, areverse" "faded/$i";
done
