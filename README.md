# OTLP Exporter Plugin
This plugin enables users to export EventStoreDB metrics via the OTLP exporter to a designated endpoint. The users have the flexibility to set up an collector endpoint as per their requirements. For example, they can configure an OTEL collector to receive, process, and export metrics as desired.
To read more on the OTEL collector, please visit the following URL:-
https://opentelemetry.io/docs/collector/

To enable the OTLP Exporter, you will need to download the plugin and place it in the plugins folder in your EventStoreDB installation directory. EventStore should use it the next time it starts up. Additionally, you also need to provide the otlp-exporter.json file which should include the necessary information in the specified format:-
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

After successful installation the server should log a similar message like below:
```

[ 9408, 1,12:47:10.982,INF] Loaded SubsystemsPlugin plugin: "otlp-exporter" "24.2.0.0".
```

By default, the OTLP exporter does not export the metrics. You must provide an otlp-exporter.json config file to enable this functionality. The following options can be used in the config file to override the default values of OtlpExporterOptions:-

| Name     | Description |
|----------|---|
| Endpoint | Target to which the OTLP exporter is going to send the data |
| Headers  | Optional headers for the connection |


## Usage
The plugin can be tested by running an OTEL collector instance in Docker and configuring any exporter such as Prometheus/Jaeger/Zipkin which can scrape the data from your Endpoint.
```

EventStoreDB --> OTLP exporter --> OTEL collector --> Choice of your exporter
```

## Troubleshooting

### Plugin not loaded
The plugin has to be located in a subdirectory of the server's `plugin` directory.
To check this:
1. Go to the installation directory of the server, the directory containing the EventStoreDb executable.
2. In this directory there should be a directory called `plugins`, create it if this is not the case.
3. The `plugins` directory should have a subdirectory for the plugin, for instance called `EventStore.OtlpExporterPlugin` but this could be any name. Create it if it doesn't exist.
4. The binaries of the plugin should be located in the subdirectory which was checked in the previous step.

### EventStoreDB metrics not exported to endpoint
Make sure the otlp-exporter.json file exists in your configuration folder with correct format. The plugin will not be able to push the metrics if the configuration file is missing or the format is incorrect. In this case, the EventStoreDB logs the message like below to notify the user:-
```
[ 9408, 1,12:48:10.982,INF] OtlpExporter: No OpenTelemetry:Otlp configuration found. Not exporting metrics.
```
