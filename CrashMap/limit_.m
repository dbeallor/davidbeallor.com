clear;
clc;


fileid = fopen('AviationData.txt');
tline = fgetl(fileid);
lines{1} = strsplit(tline,' | ');
tline = fgetl(fileid);
ctr = 2;
while ischar(tline)
    temp = strsplit(tline,'|');
    date = strsplit(temp{4},'/');
    if (str2double(date(3))>=2000 && str2double(temp{24})>=10)
        lines{ctr} = temp;
        ctr = ctr + 1;
    end
    tline = fgetl(fileid);
end
fclose(fileid);

fileid = fopen('TrimmedAviationData.txt','w');
ctr = 1;
for i = 1:length(lines)
    for j=1:length(lines{i})
        str = char(lines{i}{j});
        if (~isempty(str) && ~strcmp(str,' ') && ~strcmp(str,'  '))
            fprintf(fileid, '%s,', strtrim(str));
        else
            fprintf(fileid, 'NULL,');
        end 
    end
    fprintf(fileid, '\n');
end


% fileid = fopen('new_dictionary.txt','w');
% counter = 1;
% for i = 1:length(words)
%     if (length(char(words(i)))<=6 && length(char(words(i)))>=3)
%         fprintf(fileid, '%s\n', char(words(i)));
%     end
% end
% fclose(fileid);





