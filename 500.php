<!-- PHP Wrapper - 500 Server Error -->
<html>

<head>

<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-TP6H8BZ');</script>
<!-- End Google Tag Manager -->

<title>500 Server Error</title>

</head>

<body bgcolor=white>

<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-TP6H8BZ"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->

<h1>500 Server Error</h1>

A misconfiguration on the server caused a hiccup.
Check the server logs, fix the problem, then try again.
<hr>

<?
  echo "URL: http://".$_SERVER['HTTP_HOST'].$_SERVER['REQUEST_URI']."<br>\n";
  $fixer = "checksuexec ".escapeshellarg($_SERVER['DOCUMENT_ROOT'].$_SERVER['REQUEST_URI']);
  echo `$fixer`;
?>

</body></html>
