clear;
clc;

fileid = fopen('dictionary.txt');
words_cell = textscan(fileid, '%s');
words = words_cell{1};
fclose(fileid);

fileid = fopen('new_dictionary.txt','w');
counter = 1;
for i = 1:length(words)
    if (length(char(words(i)))<=6 && length(char(words(i)))>=3)
        fprintf(fileid, '%s\n', char(words(i)));
    end
end
fclose(fileid);





