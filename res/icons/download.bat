if not exist cached mkdir cached
if not exist cached\avatar mkdir cached\avatar

set CURL_HEADERS=-H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36"
set CURL_HEADERS=%CURL_HEADERS% -H "Accept-Encoding: mage/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8"
set CURL_HEADERS=%CURL_HEADERS% -H "Accept-Encoding: gzip, deflate, br, zstd"
set CURL_HEADERS=%CURL_HEADERS% -H "Accept-Language: en,zh-CN;q=0.9,zh;q=0.8,en-GB;q=0.7,en-US;q=0.6"
if not defined BHB_COOKIE (
    set /p BHB_COOKIE=Enter your BHB cookie here: 
)
set CURL_HEADERS=%CURL_HEADERS% -H "Cookie: %BHB_COOKIE%"


curl %CURL_HEADERS% -O https://boyshelpboys.com/upload/avatar/000/1.png?1730880348
move 1.png cached\avatar\1.png