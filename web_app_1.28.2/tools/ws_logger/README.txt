Usage of WSLogger.exe:
======================
  -addr string
        WebSocket service address (default "192.168.17.153:50000")
  -ep string
        Trace endpoint endpoint (default "/log/v1/trace")
  -file string
        Ouput log file path (default "trace.txt")
  -version
        Print version and usage


The following example will connect to ws://192.168.17.153:50000/log/v1/trace endpoint 
and all traces from that endpoint will be saved in log_file.txt in current folder:
	WSLogger.exe --addr "192.168.1.43:50000" --file "log_file.txt"
	
	
Usage of WsLogger.py:
=====================
python and websocket-client package required to run this scrips
to install websocket-client use folowing commands:
>pip install websocket
>pip install websocket-client

Usage: WsLogger.py [options]

Options:
  --version    show program's version number and exit
  -h, --help   show this help message and exit
  --host=HOST  hostname or ip address
  --port=PORT  port (50000)

The following example will connect to ws://192.168.17.153:50000/log/v1/trace endpoint 
and all traces from that endpoint will be saved in ws.log in current folder:
	WsLogger.py --host 192.168.17.153


Usage of iWsTraceParser.py
==========================
Usage: iWsTraceParser.py [options]

Options:
  --version             show program's version number and exit
  -h, --help            show this help message and exit
  --in=INPUT            iWS trace file name. if not present - uses stdin
  --out=OUTPUT          output file name. if not present - uses stdout
  --show_source_line=SHOW_SOURCE_LINE
                        show_source_line (1: on, 0: off (default off))
 
Example:
	iWsTraceParser.py --in=in_file.txt --out=out_file.txt
	iWsTraceParser.py --in=in_file.txt > out_file.txt
or
	cat log_file.txt | iWsTraceParser.py