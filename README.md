
# OTLP Exporter Plugin
This plugin allows you to push the EventStoreDB metrics to an OTEL collector endpoint. To read more on the OTEL collector, please visit the following URL:- 
https://opentelemetry.io/docs/collector/

To enable the OTLP Exporter, you will need to download the plugin and add it to the plugins folder in your EventStoreDB installation directory. EventStore should use it the next time it starts up. Additionally, you also need to provide the otlp-exporter.json file which contains the information in the following format:- 
```
﻿{
	"OpenTelemetry": {
		"Otlp": {
			"Endpoint": "http://localhost:4317"
		}
	}
}
```

The file path for the otlp-exporter.json would be the same as for all the other configuration files. For example:- 

The default configuration file name for EventStoreDB is eventstore.conf. It is located in /etc/eventstore/ on Linux and the server installation directory on Windows.

By default, the OTLP exporter sends data using the gRPC protocol to the endpoint http://localhost:4317. The user can modify the Endpoint as per their requirements in the otlp-exporter.json file.


After successful installation the server should log a similar message like below: 
```

[ 9408, 1,12:47:10.982,INF] Loaded SubsystemsPlugin plugin: "otlp-exporter" "24.2.0.0".
```

## Troubleshooting

## Plugin not loaded
The plugin has to be located in a subdirectory of the server's `plugin` directory.
To check this:
1. Go to the installation directory of the server, the directory containing the EventStoreDb executable.
1. In this directory there should be a directory called `plugins`, create it if this is not the case.
1. The `plugins` directory should have a subdirectory for the plugin, for instance called `EventStore.OtlpExporterPlugin` but this could be any name. Create it if it doesn't exist.
1. The binaries of the plugin should be located in the subdirectory which was checked in the previous step.

## EventStoreDB metrics not exported to OTEL collector endpoint
Make sure the otlp-exporter.json file exists in your configuration folder and format is correct. The plugin will not be able to push the metrics if the configuration file is missing or the format is incorrect. In this case, the EventStoreDB logs the message like below to notify the user:-  
```
[ 9408, 1,12:48:10.982,INF] OtlpExporter: No OpenTelemetry:Otlp configuration found. Not exporting metrics.
```
