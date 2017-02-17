clear;
clc;


fileid = fopen('AviationData.txt');
tline = fgetl(fileid);
lines{1} = strsplit(tline,' | ');
tline = fgetl(fileid);
ctr = 2;
while ischar(tline)
    lines{ctr} = strsplit(tline,'|');
    ctr = ctr + 1;
    tline = fgetl(fileid);
end
fclose(fileid);

x = 0:300;
y = zeros(151);

for i = 2:length(lines)
    num = lines{i}{24};
    if (~isempty(num) && ~strcmp(num,' ') && ~strcmp(num,'  '))
        num_killed = str2double(num);
        y(num_killed+1) = y(num_killed+1) + 1;
    end
end

figure();
plot(x,y,'-k');
